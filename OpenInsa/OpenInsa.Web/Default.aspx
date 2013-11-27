<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="EntLib.iBatis.Default" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <style type="text/css">

TABLE {
	SCROLLBAR-FACE-COLOR: #f7f7f7; FONT-SIZE: 9pt; SCROLLBAR-HIGHLIGHT-COLOR: #ffffff; SCROLLBAR-SHADOW-COLOR: #cccccc; COLOR: #585858; SCROLLBAR-3DLIGHT-COLOR: #ffffff; LINE-HEIGHT: 18px; SCROLLBAR-ARROW-COLOR: #cccccc; SCROLLBAR-TRACK-COLOR: #ffffff; FONT-FAMILY: "돋움", "Seoul", "arial", "Verdana", "helvetica"; SCROLLBAR-DARKSHADOW-COLOR: #ffffff;
	margin-right: 1px;
}
TR {
	SCROLLBAR-FACE-COLOR: #f7f7f7; FONT-SIZE: 9pt; SCROLLBAR-HIGHLIGHT-COLOR: #ffffff; SCROLLBAR-SHADOW-COLOR: #cccccc; COLOR: #585858; SCROLLBAR-3DLIGHT-COLOR: #ffffff; LINE-HEIGHT: 18px; SCROLLBAR-ARROW-COLOR: #cccccc; SCROLLBAR-TRACK-COLOR: #ffffff; FONT-FAMILY: "돋움", "Seoul", "arial", "Verdana", "helvetica"; SCROLLBAR-DARKSHADOW-COLOR: #ffffff
}
TD {
	SCROLLBAR-FACE-COLOR: #f7f7f7; FONT-SIZE: 9pt; SCROLLBAR-HIGHLIGHT-COLOR: #ffffff; SCROLLBAR-SHADOW-COLOR: #cccccc; COLOR: #585858; SCROLLBAR-3DLIGHT-COLOR: #ffffff; LINE-HEIGHT: 18px; SCROLLBAR-ARROW-COLOR: #cccccc; SCROLLBAR-TRACK-COLOR: #ffffff; FONT-FAMILY: "돋움", "Seoul", "arial", "Verdana", "helvetica"; SCROLLBAR-DARKSHADOW-COLOR: #ffffff
}
    </style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <table id="LoginForm" runat="server" border="0" cellpadding="0" cellspacing="3">
            <tr>
                <td>
                    <h5>
                    </h5>
                    <h5>
                        &nbsp;</h5>
                    <h5>
                        &nbsp;</h5>
                    <h5>
                        <b>&quot;로그인 하세요&quot;</b></h5>
                </td>
            </tr>
            <tr>
                <td>
                    Your Name :<br />
                    <asp:TextBox ID="txtName" value="mkkim" runat="server" Height="20px" Width="200px"></asp:TextBox>
                    &nbsp;
                </td>
            </tr>
            <tr>
                <td>
                    Your Password :<br />
                    <asp:TextBox ID="txtPwd" value="1111" runat="server" Height="20px" TextMode="Password" 
                        Width="200px"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    <br />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Button ID="btnLoginOK" runat="server" Text="OK" 
                        Width="60px" onclick="btnLoginOK_Click" />
                    <asp:Button ID="Cancle_btn" runat="server" Text="Cancle" Width="60px" />
                    <asp:Button ID="Button1" runat="server" Text="Regidit" 
                        Width="60px" onclick="Button1_Click" />
                    <br />
                </td>
            </tr>
        </table>
    
    </div>
    <table id="loginchk" runat="server">
        <tr>
            <td>
                <asp:Button ID="btn_enterCancel" runat="server" BackColor="GreenYellow" 
                    Height="0px" OnClientClick="return false;" Text="" Width="0px" />
                <asp:Label ID="namelbl2" runat="server" ForeColor="#333333"></asp:Label>
                님 로그인
                <asp:Button ID="btnLogOut" runat="server" style="height: 21px" TabIndex="1000" 
                    Text="LogOut" onclick="btnLogOut_Click" />
                &nbsp;<br />
                <br />
                <asp:Button ID="GotoBoar_btn" runat="server" Text="게시판 보러가기" 
                    onclick="GotoBoar_btn_Click" Width="178px" />&nbsp;&nbsp;</td>
        </tr>
    </table>
    </form>
</body>
</html>

