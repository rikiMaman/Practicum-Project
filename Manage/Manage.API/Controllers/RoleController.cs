﻿using AutoMapper;
using Manage.API.Models;
using Manage.Core.DTOs;
using Manage.Core.Models;
using Manage.Core.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Manage.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        // GET: api/<RoleController>
        private readonly IRoleService _roleService;
        private readonly IMapper _mapper;
        public RoleController(IRoleService roleService, IMapper mapper)
        {
            _roleService = roleService;
            _mapper = mapper;
        }

        // GET: api/<RoleController>
        [HttpGet]
        public ActionResult Get()
        {
            var list = _roleService.GetAll();
            var listDto = list.Select(r => _mapper.Map<RoleDto>(r));
            return Ok(listDto);
        }



        // GET api/<RoleController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var role = _roleService.GetById(id);
            var roleDto = _mapper.Map<RoleDto>(role);
            return Ok(roleDto);
        }

        // POST api/<RoleController>
        [HttpPost]
        public async Task<ActionResult> PostAsync([FromBody] RolePostModel value)
        {
            var roleToAdd = _mapper.Map<Role>(value);
            var addedRole = await _roleService.Post(roleToAdd);
            var newRole = _roleService.GetById(addedRole.Id);
            var roleDto = _mapper.Map<RoleDto>(newRole);
            return Ok(roleDto);
        }


    }
}
