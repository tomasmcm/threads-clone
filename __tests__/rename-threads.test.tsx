import { render, screen } from '@testing-library/react';
import { siteConfig } from '@/config/site';

describe('Rename Threads to Smiths', () => {
  it('should use "Smiths" in site config', () => {
    expect(siteConfig.name).toBe('Smiths');
    expect(siteConfig.description).toContain('smiths');
    expect(siteConfig.url).toContain('smiths.codebustar.com');
  });
});
