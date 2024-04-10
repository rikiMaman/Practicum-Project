using Manage.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAll();
        public Employee GetById(int id);
        public Task<Employee> Post(Employee employee);
        public Task<Employee> PutAsync(int id, Employee employee);
        public void Delete(int id);
    }
}
