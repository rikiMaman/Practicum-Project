using Manage.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Data
{
    public class DataContext: DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Role> roles { get; set; }
        public DbSet<RoleEmployee> roleEmployees { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=Employees;Integrated Security=true; User ID=Riki;Password=1234; TrustServerCertificate=True");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // הגדרת קשרים בין Employee ל RoleEmployee
            modelBuilder.Entity<RoleEmployee>()
                .HasOne(re => re.Employee) // כל RoleEmployee יש Employee אחד
                .WithMany(e => e.Roles)    // לכל Employee יש רשימת RoleEmployee
                .HasForeignKey(re => re.EmployeeId); // המפתח הזר הוא EmployeeId

        }

        internal bool Find(Func<object, bool> value)
        {
            throw new NotImplementedException();
        }
    }
}
