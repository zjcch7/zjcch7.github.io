import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CharacterComponent } from './character.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        CharacterComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CharacterComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'FictionBattles'`, () => {
    const fixture = TestBed.createComponent(CharacterComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('FictionBattles');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CharacterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('FictionBattles app is running!');
  });
});

