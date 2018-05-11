import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

declare var googleyolo: any;
declare var FB: any;
declare var window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  Pictures: string[] = []
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService )
    {
    window.fbAsyncInit = () => {
      FB.init({
                  appId      : '2060883297484199',
                  cookie     : true,
                  xfbml      : true,
                  version    : 'v2.12'
              });
              FB.AppEvents.logPageView();
          };
          (function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = <HTMLScriptElement>d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

          }

  ngOnInit() {
        }

  fblogin(){
        FB.login((credentials:any)=>{
            FB.api("/user?fields=email,name,picture", (response: any)=> {
                console.log(response);
            })
          FB.api("/users/photos", (response: any)=> {
                          for(var img of response.data){
                              FB.api(`/${img.id}?fields=images`, (imgOb: any)=> {
                                  this.Pictures.push( imgOb.images[0].source );
                                  console.log(imgOb);
                              })
                          }
                          console.log(response);
                      })
                  }, { scope: "email,user_photos" })
              }


    googlelogin(){
      googleyolo.hint({
          supportedAuthMethods: [
            "https://accounts.google.com"
          ],
          supportedIdTokenProviders: [
            {
              uri: "https://accounts.google.com",
              clientId: "127811445743-8uo1b7vbretscar7t4kmuqiu8mhq04a5.apps.googleusercontent.com"
            }
          ]
      }).then((credentials: any) =>{
          this.authService.authenticateUser(credentials.user);
          console.log(credentials);
      })

    }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.authenticateUser(user).subscribe(data => {
        if(data.success) {
          this.authService.storeUserData(data.token, data.user);
          this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 5000});
          this.router.navigate(['dashboard']);
        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate(['login']);
        }
    });
  }

}
