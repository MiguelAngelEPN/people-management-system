using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using UserServiceAPI.Models;
using System;

namespace UserServiceAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }
        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<PersonModel> Person { get; set; } = null!;
        public DbSet<RoleModel> Role { get; set; } = null!;
    }
}
