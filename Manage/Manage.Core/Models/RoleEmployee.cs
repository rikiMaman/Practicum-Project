using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.Models
{
    public class RoleEmployee
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public bool IsAdministrative { get; set; }
        public DateTime StartWork { get; set; }
    }
    
}
