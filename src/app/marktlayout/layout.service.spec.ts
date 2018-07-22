import { TestBed, inject } from '@angular/core/testing';

import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutService]
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));

  it('should generate default layout for single entry', inject(
    [LayoutService],
    (service: LayoutService) => {
      const layoutEntries = service.generateDefaultLayout([{ systemId: 1 }], 500);

      expect(layoutEntries.length).toBe(1);

      const entry = layoutEntries[0];
      expect(entry.angle).toBe(0);
      expect(entry.x).toBe(10);
      expect(entry.y).toBe(10);
      expect(entry.height).toBe(40);
      expect(entry.width).toBe(150);
      expect(entry.systemId).toBe(1);
    }
  ));

  it('should generate simple default layout', inject([LayoutService], (service: LayoutService) => {
    const nodes = [{ systemId: 1 }, { systemId: 15 }, { systemId: 99 }];
    const layoutEntries = service.generateDefaultLayout(nodes, 500);

    expect(layoutEntries.length).toBe(3);

    for (let i = 0; i < layoutEntries.length; i++) {
      const entry = layoutEntries[i];
      expect(entry.angle).toBe(0);
      expect(entry.height).toBe(40);
      expect(entry.width).toBe(150);
      expect(entry.x).toBe(10 + (150 + 10) * i);
      expect(entry.y).toBe(10);
      expect(entry.systemId).toBe(nodes[i].systemId);
    }
  }));

  it('should generate simple layout with 2 rows', inject(
    [LayoutService],
    (service: LayoutService) => {
      const nodes = [{ systemId: 1 }, { systemId: 15 }, { systemId: 99 }];
      const layoutEntries = service.generateDefaultLayout(nodes, 400);

      expect(layoutEntries.length).toBe(3);

      for (let i = 0; i < layoutEntries.length; i++) {
        const entry = layoutEntries[i];
        expect(entry.angle).toBe(0);
        expect(entry.height).toBe(40);
        expect(entry.width).toBe(150);
        if (i < 2) {
          expect(entry.x).toBe(10 + (150 + 10) * i);
          expect(entry.y).toBe(10);
        } else {
          expect(entry.x).toBe(10);
          expect(entry.y).toBe(60);
        }
        expect(entry.systemId).toBe(nodes[i].systemId);
      }
    }
  ));
});
