namespace GameHub.Application.DTOs.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public int StatusCode { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success") => new()
    {
        Success = true, Message = message, Data = data, StatusCode = 200
    };

    public static ApiResponse<T> Created(T data, string message = "Created") => new()
    {
        Success = true, Message = message, Data = data, StatusCode = 201
    };

    public static ApiResponse<T> BadRequest(string message, List<string>? errors = null) => new()
    {
        Success = false, Message = message, Errors = errors, StatusCode = 400
    };

    public static ApiResponse<T> NotFound(string message = "Not found") => new()
    {
        Success = false, Message = message, StatusCode = 404
    };

    public static ApiResponse<T> Unauthorized(string message = "Unauthorized") => new()
    {
        Success = false, Message = message, StatusCode = 401
    };

    public static ApiResponse<T> Forbidden(string message = "Forbidden") => new()
    {
        Success = false, Message = message, StatusCode = 403
    };
}

public class PagedResponse<T> : ApiResponse<T>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public int TotalRecords { get; set; }
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}
