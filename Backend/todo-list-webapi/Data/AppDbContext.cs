using Microsoft.EntityFrameworkCore;
using todo_list_webapi.Models;

namespace todo_list_webapi.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<TodoItem> TodoItems { get; set; }
}
