namespace UserServiceAPI.Common
{
    public class ApiResponse
    {
        public int Code { get; set; }          // HTTP code (200, 400, 500, etc)
        public string Status { get; set; }     // "success", "error"
        public string Message { get; set; }    // Mensaje claro que informa que pasó
        public Object? Data { get; set; }           // Puede ser null dependiendo del endpoint

    }
}
