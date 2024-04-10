using Manage.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.Services
{
    public interface IRoleService
    {
        public IEnumerable<Role> GetAll();
        public Role GetById(int id);
        public Task<Role> Post(Role role);

    }
}
