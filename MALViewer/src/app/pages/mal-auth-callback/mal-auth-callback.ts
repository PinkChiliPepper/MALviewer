import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-mal-auth-callback',
  template: `<p>Logging you in...</p>`,
})
export class MALAuthCallback implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    console.log('!!!!')
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.auth.exchangeCodeForToken(code);
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }
}
