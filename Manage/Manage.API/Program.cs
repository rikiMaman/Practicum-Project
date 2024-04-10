
using Manage.API.Mapping;
using Manage.Core.Repositories;
using Manage.Core.Services;
using Manage.Data.Repositories;
using Manage.Data;
using Manage.Core;
using Manage.Service;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var policy = "policy";
builder.Services.AddCors(option => option.AddPolicy(name: policy, policy =>
{
    policy.AllowAnyOrigin(); policy.AllowAnyHeader(); policy.AllowAnyMethod();
}));

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
//builder.Services.AddScoped<IRoleService, RoleService>();
//builder.Services.AddScoped<IRoleEmployeeRepository, RoleEmployeeRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddDbContext<DataContext>();
builder.Services.AddAutoMapper(typeof(MappingProfile), typeof(ApiMappingProfile));
var app = builder.Build();

app.UseCors(builder =>
{
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors(policy);
app.MapControllers();
app.Run();