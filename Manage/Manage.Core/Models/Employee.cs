using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.Models
{
    public enum Sex
    {
        Male = 0, Female = 1,
    }
    public class Employee
    {
        public int Id { get; set; }
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Indetity { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }
        public bool IsActive { get; set; }
        public List<RoleEmployee> Roles { get; set; }
        public Employee()
        {
            Roles = new List<RoleEmployee>();
        }
    }
}
