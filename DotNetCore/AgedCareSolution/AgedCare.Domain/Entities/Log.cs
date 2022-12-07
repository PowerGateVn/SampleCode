using System;
using System.ComponentModel.DataAnnotations;

namespace AgedCare.Domain.Entities
{
    public class Log
    {
        [Key]
        public long Id { get; set; }

        public string Message { get; set; }

        public string MessageTemplate { get; set; }

        public string Level { get; set; }

        public DateTime TimeStamp { get; set; }

        public string Exception { get; set; }

        public string Properties { get; set; }

        public string LogEvent { get; set; }
    }
}