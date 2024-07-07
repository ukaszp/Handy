using Microsoft.AspNetCore.Mvc;
using Handy.Api.Services.Interfaces;
using Handy.Data.Enum;
using Handy.Entities;
using HandyApi.DTOs;
using Handy.Exceptions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TaskController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        try
        {
            await _taskService.CreateTaskAsync(dto);
            return Ok("Task created successfully");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{taskId}")]
    public async Task<IActionResult> GetTask(int taskId)
    {
        try
        {
            var task = await _taskService.GetTaskAsync(taskId);
            return Ok(task);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{taskId}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        try
        {
            await _taskService.DeleteTaskAsync(taskId);
            return Ok();
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetAllActiveTasks()
    {
        var tasks = await _taskService.GetAllActiveTasksAsync();
        return Ok(tasks);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllTasks()
    {
        var tasks = await _taskService.GetAllTasksAsync();
        return Ok(tasks);
    }

    [HttpGet("{taskId}/offers")]
    public async Task<IActionResult> GetTaskOffers(int taskId)
    {
        try
        {
            var offers = await _taskService.GetTaskOffersAsync(taskId);
            return Ok(offers);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{taskId}/skills")]
    public async Task<IActionResult> GetTaskSkills(int taskId)
    {
        try
        {
            var skills = await _taskService.GetTaskSkillsAsync(taskId);
            return Ok(skills);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{taskId}/status")]
    public async Task<IActionResult> ChangeStatus(int taskId, [FromBody] StatusOfTask status)
    {
        try
        {
            await _taskService.ChangeStatusAsync(taskId, status);
            return Ok($"Task with ID {taskId} status changed to {status}.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{taskId}/description")]
    public async Task<IActionResult> ChangeTaskDescription(int taskId, [FromBody] string description)
    {
        try
        {
            await _taskService.ChangeTaskDescriptionAsync(description, taskId);
            return Ok($"Task with ID {taskId} description updated.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("finishHandy/{taskId}")]
    public async Task<IActionResult> FinishTaskHandyman(int taskId)
    {
        try
        {
            await _taskService.FinishHandyman(taskId);
            return Ok("status changed");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("finishUser/{taskId}")]
    public async Task<IActionResult> FinishUser(int taskId)
    {
        try
        {
            await _taskService.FinishUser(taskId);
            return Ok("status changed");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }


}
