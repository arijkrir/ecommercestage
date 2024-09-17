using System.Collections.Generic;
using System.Globalization;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using ProjetApi.Models;

namespace ProjetApi.Services
{
    public class CsvWriterService
    {
        public void WriteProductsToCsv(string filePath, List<ProductCsv> products)
        {
            using (var writer = new StreamWriter(filePath))
            using (var csv = new CsvWriter(writer, new CsvConfiguration(CultureInfo.InvariantCulture)))
            {
                csv.WriteRecords(products);
            }
        }
    }
}
