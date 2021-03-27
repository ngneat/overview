import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TeleportDirective } from './teleport.module';
import { TeleportService } from './teleport.service';

@Component({
  template: ` <div *teleportTo="'#projectHere'">Something here</div>
    <div id="projectHere">Hi</div>`,
})
class TestComponent {}

describe('TeleportDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let de: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TeleportDirective, TestComponent],
      providers: [TeleportService],
    }).createComponent(TestComponent);

    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('#projectHere'));
  });

  it('should project content', () => {
    expect(de.nativeElement.textContent).toBe('Something here');
  });
});
