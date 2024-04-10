using Manage.Core.Models;
using Manage.Core.Repositories;
using Manage.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Service
{
    public class RoleService: IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        public IEnumerable<Role> GetAll()
        {
            return _roleRepository.GetAll();
        }

        public Role GetById(int id)
        {
            return _roleRepository.GetById(id);
        }

        public Task<Role> Post(Role role)
        {
            return _roleRepository.Post(role);
        }

    }
}
