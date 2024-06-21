import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from "@angular/core/testing";
import {ListLinksComponent} from "./list-links.component";
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {linksFeature} from "../state/link.reducer";

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
        link: 'https://example1.com'
      },
      {
        linkId: '2',
        name: 'test link 2',
        link: 'https://example2.com'
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
  });

});
