import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEditorComponent } from './layout-editor.component';
import { NodesService } from '../../nodes/nodes.service';
import { LayoutDataService } from '../layout-data.service';
import { LayoutService } from '../layout.service';
import { TranslateModule } from '@ngx-translate/core';
import { HasAccessDirective } from '../../shared/directives/has-access.directive';
import { PanelComponent } from '../../shared/foundation-components/panel/panel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, empty } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

class MockAuthService {
  hasRoles(allowedRoles: string[], once: boolean): Observable<boolean> {
    return empty();
  }
}

describe('LayoutEditorComponent', () => {
  let component: LayoutEditorComponent;
  let fixture: ComponentFixture<LayoutEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutEditorComponent, HasAccessDirective, PanelComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        NodesService,
        LayoutDataService,
        LayoutService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
