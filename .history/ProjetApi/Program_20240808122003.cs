using ProjetApi.Data;
using Microsoft.EntityFrameworkCore;
using ProjetApi.Services;
using Microsoft.Extensions.Configuration; // Ensure this is included

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21))  // Ensure you are using the correct MySQL version
    )
);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Register services
builder.Services.AddScoped<ProductCsvService>();
builder.Services.AddScoped<CsvWriterService>();
builder.Services.AddMemoryCache(); // Add this line to register the memory cache
builder.Services.AddDistributedMemoryCache();
builder.Services.AddScoped<UserService>(); // Correct service registration

// Ensure SmtpSettings is correctly defined in your project
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));

// Ensure IEmailSender and EmailSender are correctly defined and referenced
builder.Services.AddTransient<IEmailSender, EmailSender>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();

app.UseHttpsRedirection();

// Use the CORS policy
app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
