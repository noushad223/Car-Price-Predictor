# predictorAPI/views.py

from .models import User
from .serializer import UserSerializer, RegistrationSerializer, LoginSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
import joblib
import pandas as pd
import os
from django.conf import settings
import requests

MODEL_PATH = os.path.join(settings.BASE_DIR, "model_assets", "car_price_model.joblib")
COLUMNS_PATH = os.path.join(settings.BASE_DIR, "model_assets", "model_columns.joblib")


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RegistrationAPIView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "message": "User Created Successfully. Now perform Login to get your token.",
            }
        )


class LoginAPIView(APIView):
    serializer_class = LoginSerializer
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user_id": user.pk, "email": user.email},
            status=status.HTTP_200_OK,
        )


# Load the price predictor and the models
try:
    price_model = joblib.load(MODEL_PATH)
    model_columns = joblib.load(COLUMNS_PATH)
except FileNotFoundError:
    price_model = None
    model_columns = None
    print("Could not load model")


class PricePredictorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):  # sourcery skip: extract-method
        if price_model is None or model_columns is None:
            return Response(
                {"error": "Model could not be loaded"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        car_data = request.data

        required_fields = [
            "make",
            "model",
            "miles",
            "feul_type",
            "age",
            "transmission",
            "body_type",
        ]
        if any(field not in car_data for field in required_fields):
            return Response(
                {"error": f"missing one of the required fields:{required_fields}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # preparing data for the model
            input_df = pd.DataFrame([car_data])
            input_df_processed = pd.get_dummies(input_df)
            final_df = input_df_processed.reindex(columns=model_columns, fill_value=0)

            current_prediction = price_model.predict(final_df)[0]

            depreciation_data = []
            average_miles_per_year = 10000  # average in the UK

            # Loop to create a future data frame across 10 years
            for year in range(1, 10):
                future_df = final_df.copy()
                future_df["age"] = future_df["age"] + year
                future_df["miles"] = future_df["miles"] + (
                    year * average_miles_per_year
                )

                future_price = price_model.predict(future_df)[0]
                depreciation_data.append(
                    {
                        "year": int(final_df["age"].iloc[0] + year),
                        "predicted_price": round(future_price, 2),
                    }
                )

            response_data = {
                "current_predicted_price": round(current_prediction, 2),
                "depreciation_graph_data": depreciation_data,
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VehicleLookupView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        reg = request.query_params.get("registration", None)

        if not reg:
            return Response(
                {"error": "registration is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # utilise api key
            api_key = settings.VEHICLE_API_KEY
            external_api_url = f"PLACEHOLDER" f"PLACEHOLDER"

            # acquire the data from api payload
            response = requests.get(external_api_url)
            response.raise_for_status()
            # response data
            api_data = response.json()
            car_details = {
                "make": api_data.get("Make"),
                "model": api_data.get("Model"),
                "year": api_data.get("YearOfManufacture"),
                "engineSize": api_data.get("EngineCapacity"),
                "fuelType": api_data.get("FuelType"),
                "transmission": api_data.get("Transmission"),
                "colour": api_data.get("Colour"),
            }

            return Response(car_details, status=status.HTTP_200_OK)
        # raise specific error reponses
        except requests.exceptions.HTTPError as e:
            return Response(
                {"error": "Vehicle with that registration was not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Could not connect to the vehicle data service."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except AttributeError:
            return Response(
                {"error": "API Key is not configured on the server."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
