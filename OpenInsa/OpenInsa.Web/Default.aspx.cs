using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

//네임스페이스 추가 
using System.Data.SqlClient;
using System.Configuration;

namespace EntLib.iBatis
{
    public partial class Default : PageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (this.UserID != null)
            {
                namelbl2.Text = this.UserID + "님 정상 로그인 되었습니다.";

                //로그인 테이블 안보이게
                LoginForm.Visible = false;

                //세션 있다면 로그인된 상태 보이게
                loginchk.Visible = true;


            }
            else
            {
                loginchk.Visible = false;
            }



        }
        protected void Button1_Click(object sender, EventArgs e)
        {
            Response.Redirect("./Registration.aspx");
        }
        protected void btnLoginOK_Click(object sender, EventArgs e)
        {
            Profile profile = new Profile();
            profile.MEMBER_NAME = txtName.Text;
            profile.MEMBER_PWD = txtPwd.Text;

            IList<Profile> profileResult = mapper.QueryForList<Profile>("SelectProfile", profile);

            if (profileResult.Count <= 0)
            {
                ClientScriptManager cs = Page.ClientScript;
                cs.RegisterStartupScript(this.GetType(), "windowClose", "window.location.replace('./Default.aspx');", true);
                cs.RegisterStartupScript(this.GetType(), "PopupScript", "alert('잘못된 ID/PW 입니다..');", true);
            }
            else
            {
                
                //IList<Profile> profileResult = mapper.QueryForList<Profile>("SelectProfile", profile);
                // 로그인 시에 가져온 class에 필요한 정보가 다 있으므로...
                // 한번 더 DB Select 할 필요 없음.

                //세션 추가 
                Session.Add("UserID", txtName.Text);
                Session.Add("UserName", profileResult[0].MEMBER_NAME);
                Session.Add("UserPwd", profileResult[0].MEMBER_PWD);

                if (Session["UserID"] != null)
                {
                    namelbl2.Text = Session["UserID"].ToString() + "님 정상 로그인 되었습니다.";

                    //로그인 테이블 안보이게
                    LoginForm.Visible = false;

                    //센서 있다면 로그인된 상태 보이게
                    loginchk.Visible = true;
                }
            }

            #region 기존 소스
            //string connection = ConfigurationManager.AppSettings["connectionString"];
            //SqlConnection dbCon = new SqlConnection(connection);
            //string sql = "SELECT seq FROM Profile WHERE (MEMBER_NAME = @userid) AND (MEMBER_PWD = @pwd)";
            //SqlCommand dbCmd = new SqlCommand(sql, dbCon);
            //dbCmd.Parameters.Add("@userid", System.Data.SqlDbType.VarChar, 50, "MEMBER_NAME");
            //dbCmd.Parameters.Add("@pwd", System.Data.SqlDbType.NVarChar, 30, "MEMBER_PWD");

            //dbCon.Open();
            //dbCmd.Parameters["@userid"].Value = txtName.Text;
            //dbCmd.Parameters["@pwd"].Value = txtPwd.Text;


            //if (dbCmd.ExecuteScalar() == null)
            //{

            //    ClientScriptManager cs = Page.ClientScript;
            //    cs.RegisterStartupScript(this.GetType(), "windowClose", "window.location.replace('./Default.aspx');", true);
            //    cs.RegisterStartupScript(this.GetType(), "PopupScript", "alert('잘못된 ID/PW 입니다..');", true);


            //    dbCmd.ExecuteNonQuery();
            //    dbCon.Close();
            //}
            //else
            //{

            //    dbCmd.CommandText = "select seq, MEMBER_NAME, MEMBER_PWD, EMAIL from Profile where (MEMBER_NAME = @userid)";
            //    SqlDataReader reader = dbCmd.ExecuteReader();
            //    reader.Read();

            //    //세션 추가 
            //    Session.Add("UserID", txtName.Text);
            //    Session.Add("UserName", reader["MEMBER_NAME"].ToString());
            //    Session.Add("UserPwd", reader["MEMBER_PWD"].ToString());

            //    reader.Close();
            //    dbCmd.ExecuteNonQuery();
            //    dbCon.Close();


            //    if (Session["UserID"] != null)
            //    {
            //        namelbl2.Text = Session["UserID"].ToString() + "님 정상 로그인 되었습니다.";

            //        //로그인 테이블 안보이게
            //        LoginForm.Visible = false;

            //        //센서 있다면 로그인된 상태 보이게
            //        loginchk.Visible = true;
            //    }
            //} 
            #endregion
        }
        protected void btnLogOut_Click(object sender, EventArgs e)
        {
            Session.RemoveAll();
            Response.Redirect(Request.RawUrl);
        }
        protected void GotoBoar_btn_Click(object sender, EventArgs e)
        {
            Response.Redirect("./Board_list.aspx");
        }
    }
}