using Manage.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.Repositories
{
    public interface IRoleRepository
    {
        public IEnumerable<Role> GetAll();
        public Role GetById(int id);
        public Task<Role> Post(Role role);

    }
}