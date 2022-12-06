using System;

namespace AgedCare.Application.Exceptions
{
    public class ExceptionCustom : Exception
    {
        public string FunctionName { get; set; }

        public object ObjLog { get; set; }

        public ExceptionCustom(string functionName, object objLog, string message, Exception inner) : base(message, inner)
        {
            FunctionName = functionName;
            ObjLog = objLog;
        }

        public ExceptionCustom(string functionName)
        {
            FunctionName = functionName;
        }
    }
}