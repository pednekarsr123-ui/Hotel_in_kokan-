HOTEL IN KONKAN - DEVELOPMENT STARTER
====================================

STACK
- Backend: Django 5.2 + Django REST Framework
- Database: PostgreSQL (SQLite fallback for first-run/testing)
- Frontend: React + Vite
- Authentication: Django session authentication with CSRF protection
- Admin: Django admin

IMPORTANT SECURITY NOTES
This is a development-ready starter, not a security certification or a finished production deployment.
Before production: set DEBUG=False, use a strong unique SECRET_KEY, configure ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS, serve only over HTTPS, configure a real email provider, backups, logging, monitoring, rate limiting/WAF, review permissions, run dependency/security scans, and arrange an independent security review. Never commit .env. Do not collect card details; integrate a compliant payment provider separately.

WINDOWS SETUP
1. Install Python 3.12 or 3.13 (recommended for broad package compatibility), Node.js LTS, and PostgreSQL.
2. Extract this ZIP.
3. Open the extracted folder in VS Code.
4. Backend PowerShell:
   cd backend
   py -3.12 -m venv venv
   .env\Scripts\Activate.ps1
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   Copy-Item .env.example .env
5. Edit backend/.env. Set a long random SECRET_KEY and your PostgreSQL password. Create a database named hotelinkonkan_db owned by postgres. If you want to test before PostgreSQL is ready, set DB_ENGINE=sqlite in .env.
6. Run:
   python manage.py makemigrations accounts hotels destinations packages activities bookings blogs partners
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
7. In a second terminal:
   cd frontend
   npm install
   Copy-Item .env.example .env
   npm run dev
8. Open http://localhost:5173. Admin: http://127.0.0.1:8000/admin/ . API: http://127.0.0.1:8000/api/ .

FIRST-RUN NOTES
- Create an admin user using createsuperuser.
- Add hotel/destination/package/activity/blog records through Django admin.
- Customer registration and login are available in the frontend.
- Booking creation requires login. Booking status is managed by staff/admin.
- Partner submissions are enquiries; staff can review them in admin.
- This starter intentionally does not include payment collection, SMS, email delivery, or Cloudinary credentials. These require provider accounts and deployment-specific configuration.

If PowerShell blocks venv activation, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
