import React from 'react';
import { render } from 'react-dom';

import Layout from 'components/_templates/Layout';
import PackageComparison from 'components/PackageComparison';

const Index = () => {
  return (
    <Layout>
      <PackageComparison />
    </Layout>
  );
};

export default Index;
