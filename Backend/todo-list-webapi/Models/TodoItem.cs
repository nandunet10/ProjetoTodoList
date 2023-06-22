using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace todo_list_webapi.Models;
public class TodoItem
{
    [Key][DatabaseGenerated(DatabaseGeneratedOption.Identity)] public int Id { get; set; }
    [Required][StringLength(50)] public string Title { get; set; }
    [Required] public bool IsCompleted { get; set; } = false;

}
