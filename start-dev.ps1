# Start development servers for TwinGrid

# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; uvicorn app.main:app --reload" -WindowStyle Normal

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; pnpm dev" -WindowStyle Normal

Write-Host "Development servers started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"
Write-Host "API Documentation: http://localhost:8000/docs"
