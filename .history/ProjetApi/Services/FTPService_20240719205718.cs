// using System;
// using System.IO;
// using System.Net;

// namespace ProjetApi.Services
// {
//     public class FtpService
//     {
//         private readonly string _ftpHost;
//         private readonly string _ftpUsername;
//         private readonly string _ftpPassword;

//         public FtpService(string ftpHost, string ftpUsername, string ftpPassword)
//         {
//             _ftpHost = ftpHost;
//             _ftpUsername = ftpUsername;
//             _ftpPassword = ftpPassword;
//         }

//         public void UploadFile(string localFilePath, string remoteFilePath)
//         {
//             try
//             {
//                 FtpWebRequest request = (FtpWebRequest)WebRequest.Create(remoteFilePath);
//                 request.Method = WebRequestMethods.Ftp.UploadFile;
//                 request.Credentials = new NetworkCredential(_ftpUsername, _ftpPassword);

//                 byte[] fileContents = File.ReadAllBytes(localFilePath);
//                 request.ContentLength = fileContents.Length;

//                 using (Stream requestStream = request.GetRequestStream())
//                 {
//                     requestStream.Write(fileContents, 0, fileContents.Length);
//                 }

//                 using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
//                 {
//                     Console.WriteLine($"Upload File Complete, status {response.StatusDescription}");
//                 }
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Error uploading file: {ex.Message}");
//             }
//         }
//     }
// }
