from django.urls import path
from .views import (
    PricePredictorView,
    UserListView,
    UserDetailView,
    RegistrationAPIView,
    LoginAPIView,
    VehicleLookupView,
)


urlpatterns = [
    path("register/", RegistrationAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("predict/", PricePredictorView.as_view(), name="predictor"),
    path("car-lookup/", VehicleLookupView.as_view(), name="car-lookup"),
]
