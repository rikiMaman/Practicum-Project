﻿using Manage.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core.DTOs
{
    public class RoleEmployeeDto
    {
        public int Id { get; set; }
        public Role Role { get; set; }
        public bool IsAdministrative { get; set; }
        public DateTime StartWork { get; set; }
    }
}
