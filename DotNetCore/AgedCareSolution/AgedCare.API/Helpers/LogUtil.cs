using System;
using System.IO;

namespace AgedCare.API.Helpers
{
    public class LogUtil
    {
        public static void WriteLog(string strLog)
        {
            try
            {
                FileStream fileStream;

                string logFilePath = Environment.CurrentDirectory + "\\Logs\\";
                logFilePath = logFilePath + DateTime.Today.ToString("dd-MM-yyyy") + "." + "txt";
                var logFileInfo = new FileInfo(logFilePath);
                var logDirInfo = new DirectoryInfo(logFileInfo.DirectoryName);

                if (!logDirInfo.Exists) logDirInfo.Create();

                if (!logFileInfo.Exists)
                {
                    fileStream = logFileInfo.Create();
                }
                else
                {
                    fileStream = new FileStream(logFilePath, FileMode.Append);
                }

                var log = new StreamWriter(fileStream);
                log.WriteLine(DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss.fff tt\t") + strLog);

                log.Close();
            }
            catch (Exception)
            {
                // ignored
            }
        }

        public static void WriteLogWithFolderNameAndFileName(string folderName, string fileName, string content, bool isAppendFile)
        {
            try
            {
                string path = Environment.CurrentDirectory + "\\Logs\\" + folderName;
                Directory.CreateDirectory(path);
                FileInfo fileInfo = new FileInfo(path + "\\" + fileName + ".txt");

                if (fileInfo.Directory != null && !fileInfo.Directory.Exists) fileInfo.Directory.Create();

                var filename = path + "\\" + fileName + ".txt";
                var sw = new StreamWriter(filename, isAppendFile);
                sw.WriteLine(DateTime.Now + " " + content);

                sw.Close();
            }
            catch (Exception)
            {
                // ignored
            }
        }
    }
}