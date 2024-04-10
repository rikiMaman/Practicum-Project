using AutoMapper;
using Manage.API.Models;
using Manage.Core.Models;

namespace Manage.API.Mapping
{
    public class ApiMappingProfile:Profile
    {
        public ApiMappingProfile()
        {
            //CreateMap<EmployeePostModel, Employee>().ReverseMap();


           // CreateMap<EmployeePostModel, Employee>()
           //.ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles))
           //.ReverseMap();

            CreateMap<EmployeePostModel, Employee>()
       .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.Roles.Select(roleModel => new RoleEmployee
       {
           RoleId = roleModel.RoleId,
           IsAdministrative = roleModel.IsAdministrative,
           StartWork = roleModel.StartDate // או מה שתקנה
       })))
       .ReverseMap();

            CreateMap<RoleEmployeePostModel, RoleEmployee>().ReverseMap();
            CreateMap<RolePostModel, Role>().ReverseMap();



        }
    }
}
