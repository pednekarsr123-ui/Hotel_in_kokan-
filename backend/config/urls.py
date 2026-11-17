from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from apps.hotels.views import HotelViewSet
from apps.destinations.views import DestinationViewSet
from apps.packages.views import TourPackageViewSet
from apps.activities.views import ActivityViewSet
from apps.blogs.views import BlogPostViewSet
from apps.bookings.views import BookingViewSet
from apps.partners.views import PartnerEnquiryViewSet
from apps.accounts.views import register, login_view, logout_view, me, csrf
from django.http import HttpResponse

router=DefaultRouter()
router.register("hotels", HotelViewSet)
router.register("destinations", DestinationViewSet)
router.register("packages", TourPackageViewSet)
router.register("activities", ActivityViewSet)
router.register("blogs", BlogPostViewSet)
router.register("bookings", BookingViewSet, basename="booking")
router.register("partners", PartnerEnquiryViewSet, basename="partner")

def health_check(request):
    return HttpResponse("ok", content_type="text/plain")

urlpatterns=[
 path("admin/",admin.site.urls),
 path("health/", health_check),
 path("api/",include(router.urls)),
 path("api/auth/csrf/",csrf), 
 path("api/auth/register/",register),
 path("api/auth/login/",login_view), 
 path("api/auth/logout/",logout_view), 
 path("api/auth/me/",me),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
