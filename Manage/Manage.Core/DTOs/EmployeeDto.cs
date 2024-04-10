using Manage.Core.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Indetity { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }
        public bool IsActive { get; set; }
        public List<RoleEmployeeDto> Roles { get; set; }
    }
}
