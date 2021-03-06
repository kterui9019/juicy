
import React, { useState, useContext, useEffect } from 'react';
import Router, { useRouter } from 'next/router'
import { useChannels } from '../utils/hooks/useChannels'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Link from '../components/link'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import { item } from '../types/youtuber/index';
import { GlobalProvider, GlobalContext } from '../utils/context/context';
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme: Theme) => createStyles({
    container: {
      "&:hover": {
        backgroundColor: theme.palette.grey[50],
      },
    },
    inline: {
      display: "inline",
    },
    divider: {
      paddingTop: 0,
      marginBottom: 10,
    },
    nested: {
      marginLeft: 50,
    },
    listRow: {
      paddingBottom: 10,
    },
  })
);

type Props = {
  item: item;
  key: number;
};

export default function ChannelListRow({ item }: Props) {
  const classes = useStyles();
  const ctx = useContext(GlobalContext);
  const router = useRouter();
  const handleClick = () => ctx.setTargetChannel(item);

  const { setTargetChannel }: () => void = useChannels(router.query);
  return (
    <GlobalContext.Provider value={{ item, setTargetChannel }}>
      <div className={classes.container} key={item.key}>
        <Divider component="li" className={classes.divider} />
        <div className={classes.listRow}>
          <Link onClick={handleClick} href={`/analytics?id=${item.id}`} underline="none" color="inherit">
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={item.thumbnail} />
              </ListItemAvatar>
              <ListItemText
                primary={item.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {item.description}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem className={classes.nested}>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText
                primary={`総視聴回数: ${parseInt(
                  item.viewCount
                ).toLocaleString()}回`}
              />
            </ListItem>
            <ListItem className={classes.nested}>
              <ListItemIcon>
                <SubscriptionsIcon />
              </ListItemIcon>
              <ListItemText
                primary={`チャンネル登録者数: ${parseInt(
                  item.subscriberCount
                ).toLocaleString()}人`}
              />
            </ListItem>
          </Link>
        </div>
      </div>
    </GlobalContext.Provider>
  );
}
