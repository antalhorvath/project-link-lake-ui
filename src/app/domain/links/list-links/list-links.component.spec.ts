import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ListLinksComponent} from "./list-links.component";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {linksFeature} from "../state/link.reducer";
import {LinkPageActions} from "../state/link.actions";

describe('List Links', () => {

  const initialState = {};
  let store: MockStore;
  let component: ListLinksComponent;
  let fixture: ComponentFixture<ListLinksComponent>;

  describe('Page', () => {

    const links = [
      {
        linkId: '1',
        name: 'test link 1',
        link: 'https://example1.com',
        tags: []
      },
      {
        linkId: '2',
        name: 'test link 2',
        link: 'https://example2.com',
        tags: []
      }
    ];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ListLinksComponent],
        providers: [
          provideMockStore({initialState})
        ]
      })
      store = TestBed.inject(MockStore);
      fixture = TestBed.createComponent(ListLinksComponent);
      component = fixture.componentInstance;

      store.overrideSelector(linksFeature.selectAll, links);
    });

    it('renders list of links in table', () => {
      fixture.detectChanges();
      const rows = fixture.nativeElement.querySelectorAll('table tbody tr');

      expect(rows.length).toBe(links.length);
      expect(rows[0].querySelectorAll('td')[0].textContent).toBe('test link 1');
      expect(rows[0].querySelectorAll('td')[1].textContent).toBe('https://example1.com');
      expect(rows[1].querySelectorAll('td')[0].textContent).toBe('test link 2');
      expect(rows[1].querySelectorAll('td')[1].textContent).toBe('https://example2.com');
    });

    it('initiates delete link', () => {
      fixture.detectChanges();
      const deleteButtonOfLink2 = fixture.nativeElement.querySelector('table tbody tr #delete-link-button-2');

      deleteButtonOfLink2.click();

      expect(component.linkToDelete).toEqual(links[1]);
    });

    it('dispatches delete link action', () => {
      spyOn(store, 'dispatch');
      fixture.detectChanges();
      const deleteButtonOfLink2 = fixture.nativeElement.querySelector('table tbody tr #delete-link-button-2');
      deleteButtonOfLink2.click();
      fixture.detectChanges();
      expect(component.linkToDelete).toEqual(links[1]);

      const confirmDeletionButton = fixture.nativeElement.querySelector('#delete-link-modal button#confirm');
      confirmDeletionButton.click();

      expect(store.dispatch).toHaveBeenCalledWith(LinkPageActions.deleteLink({linkId: '2'}));
    });

    it('cancels delete link action', () => {
      spyOn(store, 'dispatch');
      fixture.detectChanges();
      const deleteButtonOfLink2 = fixture.nativeElement.querySelector('table tbody tr #delete-link-button-2');
      deleteButtonOfLink2.click();
      fixture.detectChanges();

      const cancelDeletionButton = fixture.nativeElement.querySelector('#delete-link-modal button#cancel');
      cancelDeletionButton.click();

      expect(component.linkToDelete).toBeNull();
      expect(store.dispatch).toHaveBeenCalledWith(LinkPageActions.loadLinks());
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('dispatches edit link action', () => {
      spyOn(store, 'dispatch');
      fixture.detectChanges();
      const deleteButtonOfLink2 = fixture.nativeElement.querySelector('table tbody tr #edit-link-button-2');

      deleteButtonOfLink2.click();

      expect(store.dispatch).toHaveBeenCalledWith(LinkPageActions.editLink({link: links[1]}));
    });
  });

});
