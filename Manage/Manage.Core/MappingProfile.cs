using AutoMapper;
using Manage.Core.DTOs;
using Manage.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Core
{
    public class MappingProfile : Profile
    {
        //public MappingProfile()
        //{
            

        //    CreateMap<Employee, EmployeeDto>().ReverseMap();
        //    CreateMap<RoleEmployee, RoleEmployeeDto>().ReverseMap();
        //    CreateMap<Role, RoleDto>().ReverseMap();
        //}


        public MappingProfile()
        {
            //CreateMap<Employee, EmployeeDto>()
            //    .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles));

            CreateMap<Employee, EmployeeDto>()
           .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(role => new RoleEmployeeDto 
      
           { Role = role.Role, IsAdministrative = role.IsAdministrative, StartWork = role.StartWork })))
           .ReverseMap();
            CreateMap<RoleEmployee, RoleEmployeeDto>().ReverseMap();
            CreateMap<Role, RoleDto>().ReverseMap();
            // ... המרות נוספות אם נדרש ...
        }

    }
}
