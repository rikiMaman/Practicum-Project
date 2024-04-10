using Manage.Core.Models;
using Manage.Core.Repositories;
using Manage.Core.Services;
using Manage.Data;
using Manage.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manage.Service
{
    public class EmployeeService: IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        
        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
            //_context = context;
        }
        public void Delete(int id)
        {
            _employeeRepository.Delete(id);
        }

        public Task<IEnumerable<Employee>> GetAll()
        {
            return _employeeRepository.GetAll();
        }

        public Employee GetById(int id)
        {
            return _employeeRepository.GetById(id);
        }




        public async Task<Employee> Post(Employee employee)
        {
            if (!IsValidEmployee(employee))
            {
                throw new Exception("Invalid data in one or more roles, Maybe you didn't enter any role?");
            }
            else if (!IsValidBirthDate(employee.BirthDate))
            {
                throw new Exception("Invalid birth date  \n Date of birth must be at least 16 years ago and at most 120 years ago");
            }
            else if (!IsValidWorkStartAge(employee.BirthDate, employee.StartDate))
            {
                throw new Exception("Date of starting work must be at least 16 years after date of birth");
            }
            else
            {
                return await _employeeRepository.Post(employee);
            }
        }

        //public async Task<Employee> Post(Employee employee)
        //{
        //    if (!IsValidEmployee(employee))
        //    {
        //        throw new Exception("Invalid data in one or more roles");
        //    }
        //    else if (!IsValidBirthDate(employee.BirthDate))
        //    {
        //        throw new Exception("Invalid data in BirthDate");

        //    }
        //    else
        //    {
        //        return await _employeeRepository.Post(employee);
        //    }
        //}

        private bool IsValidBirthDate(DateTime birthDate)
        {
            return birthDate > DateTime.Now.AddYears(-120)&& birthDate<= DateTime.Now.AddYears(-16);
        }






        //public async Task<Employee> Post(Employee employee)
        //{
        //    //// הוסף כאן את הבדיקות הנדרשות
        //    //foreach (var role in employee.Roles)
        //    //{
        //    //    if (!await _context.roles.AnyAsync(r => r.Id == role.RoleId))
        //    //    {
        //    //        throw new Exception($"Role with ID {role.RoleId} does not exist.");
        //    //    }
        //    //}


        //        if (IsValidEmployee(employee))
        //        {
        //            return await _employeeRepository.Post(employee);
        //        }
        //        else
        //        {
        //            throw new Exception("not valid role");
        //        }




        //}
        //private bool IsValidEmployee(Employee employee)
        //{
        //    foreach (var e in employee.Roles)
        //    {
        //        if (!_employeeRepository.IsExistId(e.RoleId).Result || employee.Roles.Count
        //            (r => r.RoleId == e.RoleId) > 1 || e.StartWork.CompareTo(employee.StartDate) < 0)
        //            return false;
        //    }
        //    return true;
        //}
        private bool IsValidEmployee(Employee employee)
        {
            // בדיקה שיש לפחות תפקיד אחד
            if (employee.Roles == null || employee.Roles.Count == 0)
            {
                return false;
            }

            foreach (var e in employee.Roles)
            {
                if (!_employeeRepository.IsExistId(e.RoleId).Result || employee.Roles.Count(r => r.RoleId == e.RoleId) > 1 || e.StartWork.CompareTo(employee.StartDate) < 0)
                {
                    return false;
                }
            }
            return true;
        }



        private bool IsValidWorkStartAge(DateTime birthDate, DateTime startDate)
        {
            // חישוב הגיל בתחילת העבודה - כך שנוודא
            // שההפרש בין תאריך לידה לתאריך תחילת עבודה - הוא לפחות 16 שנים
            //כי לא ניתן לעבוד לפני גיל 16
            int ageAtStart = startDate.Year - birthDate.Year;
            if (startDate < birthDate.AddYears(ageAtStart)) ageAtStart--;
            return ageAtStart >= 16;
        }




        public Task<Employee> PutAsync(int id, Employee employee)
        {
            return (_employeeRepository.PutAsync(id, employee));
        }


    }
}
