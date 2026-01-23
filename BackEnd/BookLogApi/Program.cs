using BookLogApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));


// Angular setup 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", p =>
        p.WithOrigins("http://localhost:4200")
         .AllowAnyHeader()
         .AllowAnyMethod());
});


var app = builder.Build();

app.UseCors("AngularDev");


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// If you still get https redirect warning, comment this out:
// app.UseHttpsRedirection();

app.MapControllers();

app.Run();
