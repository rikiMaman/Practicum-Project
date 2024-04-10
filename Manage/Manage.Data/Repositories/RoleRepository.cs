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
    public class RoleRepository: IRoleRepository
    {
        private readonly DataContext _context;
        public RoleRepository(DataContext dataContext)
        {
                _context = dataContext;
        }
        public async Task<bool> RoleExists(int roleId)
        {
            return await _context.roles.AnyAsync(r => r.Id == roleId);
        }
        public async Task AddRoleEmployeeAsync(RoleEmployee roleEmployee)
        {
            if (!await RoleExists(roleEmployee.RoleId))
            {
                throw new Exception("RoleId does not exist");
            }

            _context.roleEmployees.Add(roleEmployee);
            await _context.SaveChangesAsync();
        }
        public IEnumerable<Role> GetAll()
        {
            return  _context.roles;
        }
        public Role  GetById(int id)
        {
            var e= _context.roles.Find(id);
            if (e != null) { return _context.roles.Find(id); }
            return new Role();
        }
        public async Task<Role> Post(Role role)
        {
            await _context.roles.AddAsync(role);
            await _context.SaveChangesAsync();
            return role;
        }
    }
}
