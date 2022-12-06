namespace AgedCare.Application.Utilities
{
    public class UriUtility
    {
        public static string Combine(string uri1, string uri2)
        {
            uri1 = uri1.TrimEnd('/');
            uri2 = uri2.TrimStart('/');

            return string.Format("{0}/{1}", uri1, uri2);
        }
    }
}