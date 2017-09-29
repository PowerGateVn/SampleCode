using System;
using System.Collections.Generic;
using System.Web.Mvc;
using LookGood.Api.Models;
using LookGood.Constant;
using LookGood.Entity;
using LookGood.Library;
using LookGood.Service;

namespace LookGood.Api.Controllers
{
    public class PhotoController : Controller
    {
        //
        // GET: /Photo/

        public ActionResult BrowsePhotos(int start)
        {
            HttpContext.Response.AppendHeader("Access-Control-Allow-Origin", Config.AlowDomain);
            HttpContext.Response.AppendHeader("Access-Control-Allow-Credentials", "true");
            var model = new PhotoListModel();
            bool hasMore;
            long? userId = null;
            if (Session[SessionKey.User] != null)
            {
                var user = (UserEntity)Session[SessionKey.User];
                userId = user.Id;
            }
            model.Photos = PhotoService.BrowsePhotos(start, Config.PageSize, userId, false, out hasMore);
            model.HasMore = hasMore;
            var result = new ResponseModel(ResponseStatus.Success, string.Empty, model);

            var json = Json(result);
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            return json;
        }
    }
}
