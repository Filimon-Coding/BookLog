using BookLogApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// 1) Add services
// ------------------------------------------------------------

// Controllers (API endpoints)
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database (SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// CORS (React dev server)
// Vite default: http://localhost:5173
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

// ------------------------------------------------------------
// 2) Build app
// ------------------------------------------------------------
var app = builder.Build();

// ------------------------------------------------------------
// 3) Configure middleware (HTTP pipeline)
// ------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// If you keep seeing HTTPS redirect warnings while testing locally,
// you can leave this commented out.
// app.UseHttpsRedirection();

app.UseRouting();

// Apply CORS BEFORE mapping endpoints
app.UseCors("FrontendDev");

// Authorization middleware (safe even if you have no auth yet)
app.UseAuthorization();

// ------------------------------------------------------------
// 4) Map endpoints
// ------------------------------------------------------------
app.MapControllers();

// ------------------------------------------------------------
// 5) Run
// ------------------------------------------------------------
app.Run();
