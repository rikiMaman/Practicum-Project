using Manage.Core.Models;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace Manage.API.Models
{
    public class EmployeePostModel
    {
        [Required]
        [MinLength(2, ErrorMessage = "First name must be at least 2 characters long")]
        public string FirstName { get; set; }
        [Required]
        [MinLength(2, ErrorMessage = "Last name must be at least 2 characters long")]
        public string LastName { get; set; }
        [Required]
        [RegularExpression("^[0-9]{9}$", ErrorMessage = "Identity number must be exactly 9 digits")]
        public string Indetity { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        [Required]
        public Sex Sex { get; set; }
        public bool IsActive { get; set; }
        public List<RoleEmployeePostModel> Roles { get; set; }
    }
}