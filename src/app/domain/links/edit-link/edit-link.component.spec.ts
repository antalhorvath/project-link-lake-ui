import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditLinkComponent} from './edit-link.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {LinkPageActions} from "../state/link.actions";
import {Link} from "../state/link.model";

describe('EditLinkComponent', () => {
  let component: EditLinkComponent;
  let fixture: ComponentFixture<EditLinkComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLinkComponent],
      providers: [provideMockStore()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('gets created', () => {
    expect(component).toBeTruthy();
  });

  describe('Code', () => {

    describe('link form', () => {
      it('is valid', () => {
        component.linkForm.get('name')?.setValue('test link');
        component.linkForm.get('link')?.setValue('https://example.com');
        expect(component.linkForm.valid).toBeTruthy();
      });

      it('has invalid name', () => {
        component.linkForm.get('name')?.setValue('');
        component.linkForm.get('link')?.setValue('https://example.com');
        expect(component.linkForm.valid).toBeFalsy();
        expect(component.linkForm.get('name')?.valid).toBeFalsy();
      });

      it('has invalid link', () => {
        const invalidLinks = [
          '',
          'asd.com',
          'https://example',
          'randomString',
          'invalidprotocol://example.com'
        ];
        component.linkForm.get('name')?.setValue('test link');
        invalidLinks.forEach(invalidLink => {
          component.linkForm.get('link')?.setValue('');
          expect(component.linkForm.valid).toBeFalsy();
          expect(component.linkForm.get('link')?.valid).toBeFalsy();
        })
      });
    });
  });

  describe('View', () => {

    it('does not submit invalid form', () => {
      spyOn(store, 'dispatch');
      const submitButton = fixture.nativeElement.querySelector('form button[type="submit"]');
      submitButton.click();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('submits link object from valid form', () => {
      component.linkForm.get('name')?.setValue('test link');
      component.linkForm.get('link')?.setValue('https://example.com');
      fixture.detectChanges();

      spyOn(store, 'dispatch');
      const submitButton = fixture.nativeElement.querySelector('form button[type="submit"]');
      submitButton.click();

      const linkToSave: Link = {
        linkId: component.linkForm.value.linkId ?? '',
        name: 'test link',
        link: 'https://example.com',
        tags: []
      };
      const action = LinkPageActions.saveLink({link: linkToSave});
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
