import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/index';
import Button from '@material-ui/core/Button';
import notify from '../lib/notify';
import confirm from '../lib/confirm';
import React, { Component } from 'react';
import { getUserBySlugApiMethod } from '../lib/api/public';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(ctx) {
    const user = await getUserBySlugApiMethod('team-builder-book');
    console.log(user);
    return { ...user };
  }

  render() {
    const { isMobile, firstGridItem } = this.props;
    return (
      <Layout isMobile={isMobile} firstGridItem={firstGridItem}>
        <div>
          <Head>
            <title>Index page</title>
            <meta
              name="description"
              content="This is a description of the Index page"
            />
          </Head>
          <div
            style={{
              padding: '0px 30px',
              fontSize: '15px',
              height: '100%',
            }}
          >
            <p>Content on Index page</p>
            <Link href="/csr-page" as="/csr-page">
              <a>Go to CSR page</a>
            </Link>
            <Button onClick={() => notify('some text')}>Click me</Button>
            <Button
              onClick={() =>
                confirm({
                  title: 'Are you sure?',
                  message: 'long explanation',
                  onAnswer: async (answer) => {
                    console.log(answer);

                    if (!answer) return;

                    try {
                      notify('You successfully confirmed');
                    } catch (error) {
                      console.error(error);
                      notify(error);
                    }
                  },
                })
              }
            >
              Click me 2
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Index;
