using Manage.Core.Models;
using Manage.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Data.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly DataContext _context;
        public EmployeeRepository(DataContext dataContext)
        {
            _context = dataContext;       
        }
        public async Task<bool> IsExistId(int id)
        {
            return await _context.roles.AnyAsync(role => role.Id == id);
        }
        public void Delete(int id)
        {
            Employee e = GetById(id);
            if (e != null) { e.IsActive = false; }
            _context.SaveChanges();

        }
        public async Task<IEnumerable<Employee>> GetAll()
        {
            return await _context.Employees.Include(roleEmployee => roleEmployee.Roles)
                .ThenInclude(x => x.Role).ToListAsync();
        }
        public Employee GetById(int id)
        {
            return _context.Employees.Include(e => e.Roles).ThenInclude(x => x.Role)
                .FirstOrDefault(a => a.Id == id);

        }
        public async Task<Employee> Post(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
        public async Task<Employee> PutAsync(int id, Employee employee)
        {
            Employee e= GetById(id);
            if (e != null)
            {
                e.FirstName = employee.FirstName;
                e.LastName = employee.LastName;
                e.Indetity = employee.Indetity;
                e.BirthDate = employee.BirthDate;
                e.StartDate = employee.StartDate;
                e.Sex = employee.Sex;
                e.IsActive = employee.IsActive;
                e.Roles = employee.Roles;   
            }
            await _context.SaveChangesAsync();
            return _context.Employees.Include(e => e.Roles).ThenInclude(x => x.Role)
                .FirstOrDefault(a => a.Id == id);


        }
    }
}
