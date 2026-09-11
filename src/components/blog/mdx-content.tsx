import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import NextLink from "next/link";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";

// Posts render inside a `.prose` wrapper (see globals.css); these only add behavior.
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    if (href.startsWith("/")) {
      return (
        <NextLink href={href} {...props}>
          {children}
        </NextLink>
      );
    }

    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  },
  // Wide tables scroll on small screens instead of overflowing the page.
  table: (props) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
};

/** Compiles a post's MDX at build time (static export) and renders it. */
export async function MdxContent({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, { ...runtime, remarkPlugins: [remarkGfm] });

  return <Content components={components} />;
}
